import RegistrationForm from "../../../components/authentication/registration-form";
import PageWrapper from "../../../components/layout/page-wrapper";

export default function Register() {
  return (
    <PageWrapper centerHorizontally>
      <div className="mt-36">
        <RegistrationForm />
      </div>
    </PageWrapper>
  );
}
