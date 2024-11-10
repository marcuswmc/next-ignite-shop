import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";

import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";


interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <main
      ref={sliderRef}
      className="keen-slider flex w-full max-w-[calc(100vw-(100vw-1180px)/2)] ml-auto min-h-[656px]"
    >
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          className="keen-slider__slide flex flex-col items-center justify-center bg-[linear-gradient(180deg,#1ea483_0%,#7465d4_100%)] rounded-[8px] cursor-pointer relative overflow-hidden group"
        >
          <Image
            src={product.imageUrl}
            alt=""
            width={520}
            height={480}
            className="object-cover"
          />
          <footer className="absolute bottom-1 right-1 left-1 p-8 rounded-[6px] flex items-center justify-between bg-[rgba(0,0,0,0.6)] translate-y-[110%] opacity-0 transition-all duration-200 ease-in-out group-hover:translate-y-[0%] group-hover:opacity-100">
            <strong className="text-lg text-[#E1E1E6]">{product.name}</strong>
            <span className="text-xl font-bold text-[#00B37E]">
              {product.price}
            </span>
          </footer>
        </Link>
      ))}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    const unitAmount = price.unit_amount !== null ? price.unit_amount : 0;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "EUR",
      }).format(unitAmount / 100),
    };
  });
  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2hr
  };
};
