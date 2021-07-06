import 'package:flutter/material.dart';
import 'package:warpy/components/participant.dart';
import 'package:warpy/models/user.dart';

class ParticipantsRow extends StatelessWidget {
  List<User> participants;

  ParticipantsRow({required this.participants});

  @override
  Widget build(BuildContext context) {
    return Row(children: [Participant(user: participants[0])]);
  }
}
