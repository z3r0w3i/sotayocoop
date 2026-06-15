import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/diary_provider.dart';
import 'services/api_service.dart';
import 'services/offline_service.dart';
import 'views/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Khởi tạo các services
  final apiService = ApiService();
  final offlineService = OfflineService(apiService);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => DiaryProvider(apiService, offlineService),
        ),
      ],
      child: const GiaLaiAgriApp(),
    ),
  );
}

class GiaLaiAgriApp extends StatelessWidget {
  const GiaLaiAgriApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sổ Tay Số Nông Dân Gia Lai',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF10B981), // Emerald
        scaffoldBackgroundColor: const Color(0xFF0A0F0D), // Background dark
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          secondary: Color(0xFF059669),
          surface: Color(0xFF121915),
          background: Color(0xFF0A0F0D),
        ),
        textTheme: const TextTheme(
          titleLarge: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
          bodyMedium: TextStyle(fontFamily: 'Inter'),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
