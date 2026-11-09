import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:udv_student_client/app.dart';

void main() {
  testWidgets('App boots and renders the landing screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: UdvApp()));

    expect(find.text('UDV Student'), findsOneWidget);
  });
}
