import { stripe } from "@/lib/stripe";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string
  }
}

export default function Service({customerName, product}: SuccessProps) {
  return (
    <>
     <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name='robots' content="noindex" />
      </Head>
    
    <div className="flex flex-col items-center justify-center mx-auto h-[656px]">
      <h1 className="text-2xl text-gray-100">Compra efetuada!</h1>
      <div className="flex items-center justify-center w-full max-w-32 h-36 bg-[linear-gradient(180deg,#1ea483_0%,#7465d4_100%)] rounded-lg p-1 mt-16">
        <Image src={product.imageUrl} width={120} height={110} alt={product.name} className="object-cover"></Image>
      </div>
      <p className="text-xl text-[#C4C4CC] max-w-[560px] text-center mt-8">
      Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa. 
      </p>

      <Link href="/" className="mt-16 text-[#00875F] font-bold">
      Voltar ao catálogo
      </Link>
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {

  if(!query.session_id){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

   const customerName = session.customer_details?.name
   const product = session.line_items?.data[0].price?.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}