import 'package:flutter/material.dart';

/// Root widget. Routing will later gate between the auth and profile flows
/// based on the authentication state.
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
      home: const _BootstrapScreen(),
    );
  }
}

/// Temporary landing screen until the auth gate is wired in.
class _BootstrapScreen extends StatelessWidget {
  const _BootstrapScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('UDV Student')),
    );
  }
}
