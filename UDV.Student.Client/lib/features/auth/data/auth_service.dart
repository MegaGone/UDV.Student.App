import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../model/auth_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/providers/core_providers.dart';

class AuthService {
  const AuthService(this._api);

  final ApiClient _api;

  Future<AuthTokens> login({required String email, required String password}) async {
    final json = await _api.post('/auth/login', body: {
      'email': email,
      'password': password,
    });

    return AuthTokens.fromJson(json as Map<String, dynamic>);
  }
}

final authServiceProvider = Provider<AuthService>(
  (ref) => AuthService(ref.watch(apiClientProvider)),
);
