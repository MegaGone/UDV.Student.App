/// Static application configuration.
///
/// The host defaults to the Android emulator loopback (10.0.2.2), which maps
/// to the host machine's localhost. Override at build time with:
///   flutter run --dart-define=API_HOST=http://192.168.x.x:3000
class AppConfig {
  const AppConfig._();

  static const String apiHost = String.fromEnvironment(
    'API_HOST',
    defaultValue: 'http://10.0.2.2:3000',
  );

  static const String apiPrefix = '/api/v1';

  static String get baseUrl => '$apiHost$apiPrefix';
}
