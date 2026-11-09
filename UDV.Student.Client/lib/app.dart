import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'features/auth/view/login_screen.dart';
import 'features/auth/viewmodel/session_view_model.dart';
import 'features/profile/view/profile_screen.dart';

class UdvApp extends StatelessWidget {
  const UdvApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UDV Student',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1B396A)),
      ),
      home: const _AuthGate(),
    );
  }
}

class _AuthGate extends ConsumerWidget {
  const _AuthGate();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider);

    return session.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (_, _) => const LoginScreen(),
      data: (isAuthenticated) =>
          isAuthenticated ? const ProfileScreen() : const LoginScreen(),
    );
  }
}
