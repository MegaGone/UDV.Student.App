import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/app_config.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

/// Thin HTTP wrapper around the backend REST API.
///
/// Serializes JSON, injects the Bearer token when a route requires auth, and
/// normalizes non-2xx responses into [ApiException].
class ApiClient {
  const ApiClient(this._http, this._tokenStorage);

  final http.Client _http;
  final TokenStorage _tokenStorage;

  Future<dynamic> get(String path, {bool auth = false}) async {
    final response = await _http.get(_uri(path), headers: await _headers(auth: auth));
    return _handle(response);
  }

  Future<dynamic> post(String path, {Object? body, bool auth = false}) async {
    final response = await _http.post(
      _uri(path),
      headers: await _headers(auth: auth),
      body: body == null ? null : jsonEncode(body),
    );
    return _handle(response);
  }

  Future<dynamic> patch(String path, {Object? body, bool auth = false}) async {
    final response = await _http.patch(
      _uri(path),
      headers: await _headers(auth: auth),
      body: body == null ? null : jsonEncode(body),
    );
    return _handle(response);
  }

  Uri _uri(String path) => Uri.parse('${AppConfig.baseUrl}$path');

  Future<Map<String, String>> _headers({required bool auth}) async {
    final headers = <String, String>{'Content-Type': 'application/json'};

    if (auth) {
      final token = await _tokenStorage.readAccessToken();
      if (token != null) headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  dynamic _handle(http.Response response) {
    final isJson = (response.headers['content-type'] ?? '').contains('application/json');
    final body = response.body.isEmpty ? null : (isJson ? jsonDecode(response.body) : response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) return body;

    final message = body is Map && body['message'] != null
        ? body['message'].toString()
        : 'Request failed (${response.statusCode}).';

    throw ApiException(response.statusCode, message);
  }
}
