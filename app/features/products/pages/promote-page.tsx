import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/promote-page";
import SelectPair from "~/common/components/select-pair";
import { Calendar } from "~/common/components/ui/calendar";
import { useEffect, useState, useRef } from "react";
import { Label } from "~/common/components/ui/label";
import type { DateRange } from "react-day-picker";
import { DateTime } from "luxon";
import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import { getUserProducts } from "../queries";
import { getLoggedInUserId } from "~/features/users/queries";
import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Promote Product | ProductHunt Clone" },
    { name: "description", content: "Promote your product" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const { client } = makeSSRClient(request);

  const userId = await getLoggedInUserId(client);

  const products = await getUserProducts(client, { userId });

  return { products };
}

export default function PromotePage({ loaderData }: Route.ComponentProps) {
  const [promotionPeriod, setPromotionPeriod] = useState<
    DateRange | undefined
  >();
  const totalDays =
    promotionPeriod?.from && promotionPeriod.to
      ? DateTime.fromJSDate(promotionPeriod.to).diff(
          DateTime.fromJSDate(promotionPeriod.from),
          "days"
        ).days
      : 0;
  const widgets = useRef<TossPaymentsWidgets | null>(null);
  const initedToss = useRef<boolean>(false);
  useEffect(() => {
    const initToss = async () => {
      if (initedToss.current) return;
      initedToss.current = true;
      const toss = await loadTossPayments(
        "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
      );
      widgets.current = await toss.widgets({
        customerKey: "1111111",
      });
      await widgets.current.setAmount({
        value: 0,
        currency: "KRW",
      });
      await widgets.current.renderPaymentMethods({
        selector: "#toss-payment-methods",
      });
      await widgets.current.renderAgreement({
        selector: "#toss-payment-agreement",
      });
    };
    initToss();
  }, []);
  useEffect(() => {
    const updateAmount = async () => {
      if (widgets.current) {
        await widgets.current.setAmount({
          value: totalDays * 20000,
          currency: "KRW",
        });
      }
    };
    updateAmount();
  }, [promotionPeriod]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const product = formData.get("product") as string;
    if (!product || !promotionPeriod?.to || !promotionPeriod.from) return;
    await widgets.current?.requestPayment({
      orderId: crypto.randomUUID(),
      orderName: `WeMake Promotion for ${product}`,
      customerName: "jihwan",
      customerEmail: "jihwan.kim.sky@gmail.com",
      customerMobilePhone: "01012345678",
      metadata: {
        product,
        promotionFrom: DateTime.fromJSDate(promotionPeriod.from).toISO(),
        promotionTo: DateTime.fromJSDate(promotionPeriod.to).toISO(),
      },
      successUrl: `${window.location.href}/success`,
      failUrl: `${window.location.href}/fail`,
    });
    return (
      <div>
        <Hero
          title="Promote Your Product"
          subtitle="Boost your product's visibility."
        />
        <form className="grid grid-cols-6 gap-10" onSubmit={handleSubmit}>
          <div className="col-span-3 mx-auto flex flex-col gap-10 items-start w-1/2">
            <SelectPair
              required
              label="Select a product"
              description="Select the product you want to promote."
              name="product"
              placeholder="Select a product"
              options={loaderData.products.map((product) => ({
                label: product.name,
                value: product.product_id + "",
              }))}
            />
            <div className="flex flex-col gap-2 items-center w-full">
              <Label className="flex flex-col gap-1">
                Select a range of dates for promotion{" "}
                <small className="text-muted-foreground text-center ">
                  Minimum duration is 3 days.
                </small>
              </Label>
              <div className="w-full flex justify-center">
                <Calendar
                  mode="range"
                  selected={promotionPeriod}
                  onSelect={setPromotionPeriod}
                  min={3}
                  disabled={{ before: new Date() }}
                />
              </div>
            </div>
          </div>
          <aside className="col-span-3 px-20 flex flex-col items-center gap-10">
            <div id="toss-payment-methods" className="w-full" />
            <div id="toss-payment-agreement" />
            <Button disabled={totalDays === 0}>
              checkout (
              {(totalDays * 2000).toLocaleString("ko-KR", {
                style: "currency",
                currency: "KRW",
              })}
              원)
            </Button>
          </aside>
        </form>
      </div>
    );
  };
}
