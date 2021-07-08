import 'package:get_it/get_it.dart';
import 'package:warpy/services/services.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerSingleton<APIService>(APIService());
  locator.registerSingleton<StorageService>(StorageService());
  locator.registerSingleton<WSService>(WSService());
  locator.registerLazySingleton<SignUpService>(() => SignUpService());
  locator.registerLazySingleton<FeedService>(() => FeedService());
  locator.registerLazySingleton<StreamService>(() => StreamService());
  locator.registerLazySingleton<UserService>(() => UserService());

  locator.registerFactory<SplashViewModel>(() => SplashViewModel());
  locator.registerFactory<DevSignUpViewModel>(() => DevSignUpViewModel());
  locator.registerFactory<NewStreamViewModel>(() => NewStreamViewModel());
  locator.registerFactory<FeedViewModel>(() => FeedViewModel());
}
