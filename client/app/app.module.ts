// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
// Services
import { CatService } from './services/cat.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthenticatorService } from './services/authenticator.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
// Components
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { FeaturesComponent } from './features/features.component';
import { SolutionsComponent } from './solutions/solutions.component';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';
import { PricingComponent } from './pricing/pricing.component';
import { PaymentComponent } from './pricing/payment/payment.component';
import { FaqComponent } from './faq/faq.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PresentationComponent } from './presentation/presentation.component';
import { PresentationService } from './services/presentation.service';
import { SlideService } from './services/slide.service';
import { SlidesComponent } from './slides/slides.component';
import { TestcanvasComponent } from './testcanvas/testcanvas.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatService } from './services/chat.service';
import { WebsocketService } from './services/websocket.service';
import { PresentationDetailComponent } from './presentation-detail/presentation-detail.component';
import { SlideDetailComponent } from './slide-detail/slide-detail.component';
import { SeeMoreComponent } from './see-more/see-more.component';
import { JobComponent } from './job/job.component';
import { EduComponent } from './edu/edu.component';
import { PrivateComponent } from './private/private.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { HelpComponent } from './help/help.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { Slide2Component } from './slide2/slide2.component';

const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    CatsComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    ContactComponent,
    FooterComponent,
    FeaturesComponent,
    SolutionsComponent,
    HomeComponent,
    BlogComponent,
    SlidesComponent,
    BlogPostComponent,
    PricingComponent,
    PaymentComponent,
    FaqComponent,
    UserDashboardComponent,
    PresentationComponent,
    TestcanvasComponent,
    ChatComponent,
    PresentationDetailComponent,
    SlideDetailComponent,
    SeeMoreComponent,
    JobComponent,
    EduComponent,
    PrivateComponent,
    TestimonialsComponent,
    HelpComponent,
    TermsComponent,
    PrivacyComponent,
    Slide2Component

  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    })
  ],
  providers: [
    AuthService,
    PresentationService,
    AuthGuardLogin,
    AuthGuardAdmin,
    CatService,
    ChatService,
    WebsocketService,
    SlideService,
    UserService,
    AuthenticatorService,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
