import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule, MatBottomSheetModule,
  MatButtonModule,
  MatCardModule, MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule, MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthService} from './auth/auth.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {FormsModule} from '@angular/forms';
import {PostComponent} from './home/post/post.component';
import {HttpClientModule} from '@angular/common/http';
import {PostDetailComponent} from './home/post-detail/post-detail.component';
import {PostService} from './home/post.service';
import {PostFullComponent} from './home/post-full/post-full.component';
import {PopLoginComponent} from './pop-login/pop-login.component';
import {ProfileComponent} from './profile/profile.component';
import {ShareComponent} from './share/share.component';
import {CompressorService} from './Advanced/compressor.service';
import {UploadPostComponent} from './upload-post/upload-post.component';
import {MessagingService} from './messaging.service';
import {SettingsComponent} from './settings/settings.component';
import {ArtistCardComponent} from './home/artist-card/artist-card.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {ScrollableDirective} from './scrollable.directive';
import {FirestoreService} from './firestore.service';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PostComponent,
    PostDetailComponent,
    PostFullComponent,
    PopLoginComponent,
    ProfileComponent,
    ShareComponent,
    UploadPostComponent,
    SettingsComponent,
    ArtistCardComponent,
    NotFoundComponent,
    EditProfileComponent,
    ScrollableDirective,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBottomSheetModule,
    HttpClientModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTabsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence({
      synchronizeTabs: true
    }),
    AngularFireStorageModule,
    AngularFireMessagingModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    PostDetailComponent,
    PopLoginComponent,
    ShareComponent,
    UploadPostComponent
  ],
  providers: [
    AuthService,
    PostService,
    CompressorService,
    MessagingService,
    FirestoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
