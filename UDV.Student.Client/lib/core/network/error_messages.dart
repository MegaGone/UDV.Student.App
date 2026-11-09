import 'api_exception.dart';

/// Converts any thrown error into a Spanish, user-facing message.
/// The backend replies in English, so API errors are mapped by status code.
String mensajeDeError(Object error) {
  if (error is ApiException) {
    switch (error.statusCode) {
      case 401:
        return 'Credenciales inválidas.';
      case 403:
        return 'No tenés permisos para esta acción.';
      case 404:
        return 'No se encontró el recurso.';
      case 409:
        return 'El correo ya está registrado.';
      case 422:
        return 'No se pudo procesar la solicitud.';
      default:
        return 'Ocurrió un error. Intentá de nuevo.';
    }
  }

  return 'No se pudo conectar con el servidor.';
}
