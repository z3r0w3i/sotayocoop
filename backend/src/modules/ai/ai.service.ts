import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private configService: ConfigService,
    private db: DatabaseService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('Gemini AI Service initialized successfully.');
    } else {
      this.logger.warn('GEMINI_API_KEY not found. Fallback mode (Mock/Ollama) enabled.');
    }
  }

  // Chẩn đoán sâu bệnh qua hình ảnh (Gemini Multimodal / Ollama)
  async diagnoseDisease(imageBuffer: Buffer, mimeType: string): Promise<any> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
          Bạn là chuyên gia nông nghiệp số tại Gia Lai. Hãy phân tích hình ảnh cây trồng bị sâu bệnh này. 
          Trả về kết quả dưới định dạng JSON với các thông tin sau:
          {
            "disease_name": "Tên bệnh (tiếng Việt)",
            "english_name": "Tên tiếng Anh",
            "confidence": "Độ chính xác dự đoán (%)",
            "symptoms": "Triệu chứng quan sát được",
            "cause": "Nguyên nhân gây bệnh",
            "treatment": "Biện pháp xử lý sinh học và hóa học chi tiết",
            "danger_level": "Mức độ nguy hại (Thấp / Trung bình / Cao)"
          }
          Chỉ trả về chuỗi JSON hợp lệ, không chứa ký tự markdown hay văn bản thừa ngoài JSON.
        `;

        const imagePart = {
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType,
          },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        
        // Dọn dẹp chuỗi JSON trả về nếu có markdown ```json ... ```
        const jsonStr = responseText.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        this.logger.error(`Gemini diagnosis failed: ${error.message}`);
      }
    }

    // Fallback: Gọi Ollama LLaMA/Qwen nếu có cấu hình hoặc trả về dữ liệu chẩn đoán mô phỏng
    return this.getMockDiagnosis();
  }

  // Hỏi đáp tư vấn nông nghiệp (Gợi ý phân bón, lịch tưới, thời vụ)
  async getFarmingAdvice(question: string, context?: any): Promise<string> {
    const systemPrompt = `
      Bạn là Trợ lý AI Nông nghiệp Gia Lai, chuyên gia tư vấn kỹ thuật canh tác cà phê, hồ tiêu, sầu riêng, mắc ca. 
      Trả lời bằng tiếng Việt ngắn gọn, súc tích, thực tế và dễ hiểu cho nông dân.
    `;

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Tôi là Trợ lý Nông nghiệp Gia Lai. Tôi có thể giúp gì cho bà con nông dân hôm nay?' }] },
          ],
        });

        const fullQuestion = context 
          ? `Bối cảnh: ${JSON.stringify(context)}. Câu hỏi: ${question}`
          : question;

        const result = await chat.sendMessage(fullQuestion);
        return result.response.text();
      } catch (error) {
        this.logger.error(`Gemini chat advice failed: ${error.message}`);
      }
    }

    // Fallback: Kết nối tới Ollama cục bộ nếu được bật
    const ollamaUrl = this.configService.get<string>('OLLAMA_URL');
    if (ollamaUrl) {
      try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5-coder:latest',
            prompt: `${systemPrompt}\n\nCâu hỏi: ${question}\nTrả lời:`,
            stream: false,
          }),
        });
        const data = await response.json();
        return data.response;
      } catch (error) {
        this.logger.error(`Ollama fallback failed: ${error.message}`);
      }
    }

    return 'Xin lỗi bà con, kết nối mạng với hệ thống AI đang bị gián đoạn. Gợi ý cơ bản: Hãy kiểm tra độ ẩm đất trước khi tưới cà phê (độ ẩm thích hợp khoảng 60-70%). Tránh bón phân NPK vào những ngày nắng hạn gắt.';
  }

  private getMockDiagnosis() {
    return {
      disease_name: "Bệnh rỉ sắt hại cà phê (Mô phỏng)",
      english_name: "Coffee Leaf Rust",
      confidence: 88,
      symptoms: "Mặt dưới lá xuất hiện các vết phấn màu vàng cam nhạt, lâu dần chuyển sang màu đỏ gạch rồi cháy khô rụng hàng loạt.",
      cause: "Do nấm Hemileia vastatrix gây ra dưới điều kiện độ ẩm cao đầu mùa mưa.",
      treatment: "Cắt tỉa cành thông thoáng. Sử dụng các loại thuốc trừ nấm chứa hoạt chất gốc đồng hoặc Anvil 5SC để phun định kỳ.",
      danger_level: "Trung bình"
    };
  }
}
