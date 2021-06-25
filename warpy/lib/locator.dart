import 'package:get_it/get_it.dart';
import 'package:warpy/services/services.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerSingleton<APIService>(APIService());
  locator.registerSingleton<StorageService>(StorageService());
  locator.registerSingleton<SplashViewModel>(SplashViewModel());
  locator.registerLazySingleton<SignUpService>(() => SignUpService());
  locator.registerLazySingleton<DevSignUpViewModel>(() => DevSignUpViewModel());
  locator.registerLazySingleton<NewStreamViewModel>(() => NewStreamViewModel());
  locator.registerLazySingleton<FeedViewModel>(() => FeedViewModel());
  locator.registerLazySingleton<FeedService>(() => FeedService());
}
