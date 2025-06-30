// import PageWrapper from "@/components/layout/page-wrapper";
// import TopUp from "@/components/pages/wallets/top-up";
// import { currencies } from "@/lib/helpers/utils";
// import { stripe } from "@/lib/stripe/stripe";
// import { ArrowUpCircleIcon, BanknotesIcon } from "@heroicons/react/24/solid";
// import { redirect } from "next/navigation";

export default async function TopUpPage() { // {}: // searchParams,
// {
//   searchParams: Promise<{
//     canceled?: boolean;
//     success?: boolean;
//     session_id?: string;
//   }>;
// }
  throw new Error("Unimplemented");

  // const { canceled, success, session_id } = await searchParams;

  // if (success && !session_id) {
  //   throw new Error("Please provide a valid session ID.");
  // }

  // let returnedStatus;
  // if (session_id) {
  //   const {
  //     status,
  //     // customer_details: { email: returnedEmail },
  //   } = await stripe.checkout.sessions.retrieve(session_id, {
  //     expand: ["line_items", "payment_intent"],
  //   });

  //   returnedStatus = status;
  // }

  // if (returnedStatus === "open") {
  //   redirect("/");
  // }

  // return (
  //   <PageWrapper centerHorizontally>
  //     <div className="flex flex-col mx-6 sm:mx-4 w-full max-w-[650px] gap-6">
  //       {canceled && (
  //         <div role="alert" className="alert alert-error">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="h-6 w-6 shrink-0 stroke-current"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  //             />
  //           </svg>
  //           <span>Top up cancelled, please try again.</span>
  //         </div>
  //       )}
  //       {returnedStatus === "complete" && (
  //         <div role="alert" className="alert alert-success">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="h-6 w-6 shrink-0 stroke-current"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  //             />
  //           </svg>
  //           <span>
  //             Top up successfull! A confirmation email will be sent to you.
  //           </span>
  //         </div>
  //       )}
  //       <div className="card card-border bg-base-200 shadow-xs border border-base-100 w-full">
  //         <div className="relative card-body">
  //           <h2 className="card-title font-bold">
  //             <BanknotesIcon className="size-7" /> Balances
  //           </h2>
  //           <ul className="flex flex-col gap-2 mt-1">
  //             {currencies.map((currency) => (
  //               <li key={currency.code}>{currency.code} 0</li>
  //             ))}
  //           </ul>
  //         </div>
  //       </div>
  //       <div className="card card-border bg-base-200 shadow-xs border border-base-100 w-full">
  //         <div className="card-body">
  //           <h2 className="card-title font-bold">
  //             <ArrowUpCircleIcon className="size-7" /> Top up
  //           </h2>
  //           <TopUp />
  //         </div>
  //       </div>
  //     </div>
  //   </PageWrapper>
  // );
}
