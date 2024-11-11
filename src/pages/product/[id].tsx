import { stripe } from "@/lib/stripe";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Stripe from "stripe";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const [isCreateCheckoutSession, setIsCreateCheckoutSession] = useState(false);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  async function handleBuyProduct() {
    try {
      setIsCreateCheckoutSession(true);
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreateCheckoutSession(false);
      console.error("Failed redirect to checkout", error);
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <main className="flex gap-16 w-full max-w-[1180px] justify-center my-0 mx-auto">
        <div className="w-full max-w-[576px] bg-[linear-gradient(180deg,#1ea483_0%,#7465d4_100%)] h-[600px] rounded-lg p-1 flex items-center justify-center">
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt=""
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl text-[#C4C4CC]">{product.name}</h1>
          <span className="mt-4 block text-2xl text-[#00875F]">
            {product.price}
          </span>

          <p className="mt-10 text-base leading-[1.6] text-[#C4C4CC]">
            {product.description}
          </p>

          <button
            disabled={isCreateCheckoutSession}
            onClick={handleBuyProduct}
            className="mt-auto bg-[#00875F] border-0 text-white rounded-lg p-5 cursor-pointer font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Comprar agora
          </button>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Produtos mais vendidos / mais acessados
  return {
    paths: [{ params: { id: "prod_RArAD7jx8G91ue" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = String(params?.id);

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;
  const unitAmount = price.unit_amount !== null ? price.unit_amount : 0;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "EUR",
        }).format(unitAmount / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 01 hours
  };
};
