import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../viewmodel/register_view_model.dart';

/// Admin-only form to create a new user account.
class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final created = await ref.read(registerViewModelProvider.notifier).submit(
          email: _emailController.text.trim(),
          username: _usernameController.text.trim(),
          password: _passwordController.text,
        );

    if (!mounted) return;

    if (created) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('User created')),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(registerViewModelProvider);
    final isLoading = state.isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Create user')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Email'),
                  validator: (value) =>
                      (value == null || !value.contains('@')) ? 'Enter a valid email' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(labelText: 'Username'),
                  validator: (value) => (value == null || value.trim().length < 8)
                      ? 'At least 8 characters'
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(labelText: 'Password'),
                  validator: (value) =>
                      (value == null || value.isEmpty) ? 'Enter a password' : null,
                ),
                const SizedBox(height: 8),
                if (state.hasError)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      state.error.toString(),
                      style: TextStyle(color: Theme.of(context).colorScheme.error),
                    ),
                  ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: isLoading ? null : _submit,
                  child: isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Create'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
