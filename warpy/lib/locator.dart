import 'package:get_it/get_it.dart';
import 'package:warpy/services/services.dart';
import 'package:warpy/views/dev_signup/dev_signup_viewmodel.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerSingleton<APIService>(APIService());
  locator.registerSingleton<StorageService>(StorageService());
  locator.registerLazySingleton<SignUpService>(() => SignUpService());
  locator.registerLazySingleton<DevSignUpViewModel>(() => DevSignUpViewModel());
}
