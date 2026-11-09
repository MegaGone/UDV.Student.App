import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/auth_service.dart';

/// Drives the admin "create user" form. The [AsyncValue] state exposes
/// idle/loading/error; [submit] returns whether the account was created.
class RegisterViewModel extends AsyncNotifier<void> {
  @override
  FutureOr<void> build() {}

  Future<bool> submit({
    required String email,
    required String username,
    required String password,
  }) async {
    state = const AsyncLoading();

    state = await AsyncValue.guard(() async {
      await ref.read(authServiceProvider).register(
            email: email,
            username: username,
            password: password,
          );
    });

    return !state.hasError;
  }
}

final registerViewModelProvider = AsyncNotifierProvider<RegisterViewModel, void>(
  RegisterViewModel.new,
);
