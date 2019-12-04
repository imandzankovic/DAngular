// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// Services
import { AuthGuardLogin } from "./services/auth-guard-login.service";
import { AuthGuardAdmin } from "./services/auth-guard-admin.service";
// Components
import { CatsComponent } from "./cats/cats.component";
import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { AccountComponent } from "./account/account.component";
import { AdminComponent } from "./admin/admin.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ContactComponent } from "./contact/contact.component";
import { FeaturesComponent } from "./features/features.component";
import { SolutionsComponent } from "./solutions/solutions.component";
import { HomeComponent } from "./home/home.component";
import { BlogComponent } from "./blog/blog.component";
import { BlogPostComponent } from "./blog/blog-post/blog-post.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PaymentComponent } from "./pricing/payment/payment.component";
import { FaqComponent } from "./faq/faq.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { OldPresentationComponent } from "./old-presentation/old-presentation.component";
import { TestcanvasComponent } from "./testcanvas/testcanvas.component";
import { ChatComponent } from "./chat/chat.component";
import { PresentationDetailComponent } from "./presentation-detail/presentation-detail.component";
import { SlideDetailComponent } from "./slide-detail/slide-detail.component";
import { SeeMoreComponent } from "./see-more/see-more.component";
import { JobComponent } from "./job/job.component";
import { EduComponent } from "./edu/edu.component";
import { PrivateComponent } from "./private/private.component";
import { TestimonialsComponent } from "./testimonials/testimonials.component";
import { HelpComponent } from "./help/help.component";
import { TermsComponent } from "./terms/terms.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { SlidesPanelComponent } from "./slides-panel/slides-panel.component";
import { PresentationComponent } from "./presentation/presentation.component";
import { NewSlideComponent } from "./new-slide/new-slide.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "see-more", component: SeeMoreComponent },
  { path: "job", component: JobComponent },
  { path: "edu", component: EduComponent },
  { path: "private", component: PrivateComponent },
  { path: "careers", component: TestimonialsComponent },
  { path: "help", component: HelpComponent },
  { path: "terms", component: TermsComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "slides-panel", component: SlidesPanelComponent },
  { path: "chat/:id", component: ChatComponent },
  { path: "about", component: AboutComponent },
  { path: "cats", component: CatsComponent },
  { path: "contact", component: ContactComponent },
  { path: "features", component: FeaturesComponent },
  { path: "solutions", component: SolutionsComponent },
  { path: "blog", component: BlogComponent },
  { path: "blog-post", component: BlogPostComponent },
  { path: "pricing", component: PricingComponent },
  { path: "payment", component: PaymentComponent },
  { path: "faq", component: FaqComponent },
  { path: "user-dashboard", component: UserDashboardComponent },
  { path: "old-presentation/:id", component: OldPresentationComponent },
  { path: "presentation/:id", component: NewSlideComponent },
  { path: "presentationDetail/:id", component: PresentationDetailComponent },
  { path: "slide/:id", component: SlideDetailComponent },
  { path: "canvas", component: TestcanvasComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [AuthGuardLogin]
  },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: "notfound", component: NotFoundComponent },
  { path: "**", redirectTo: "/notfound" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
