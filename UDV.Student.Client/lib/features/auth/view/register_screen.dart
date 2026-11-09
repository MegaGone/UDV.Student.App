import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/error_messages.dart';
import '../viewmodel/register_view_model.dart';

/// Formulario (solo admin) para crear un nuevo usuario.
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
        const SnackBar(content: Text('Usuario creado')),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(registerViewModelProvider);
    final isLoading = state.isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Crear usuario')),
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
                  decoration: const InputDecoration(labelText: 'Correo'),
                  validator: (value) =>
                      (value == null || !value.contains('@')) ? 'Ingresá un correo válido' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(labelText: 'Usuario'),
                  validator: (value) => (value == null || value.trim().length < 8)
                      ? 'Mínimo 8 caracteres'
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(labelText: 'Contraseña'),
                  validator: (value) =>
                      (value == null || value.isEmpty) ? 'Ingresá una contraseña' : null,
                ),
                const SizedBox(height: 8),
                if (state.hasError)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      mensajeDeError(state.error!),
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
                      : const Text('Crear'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
