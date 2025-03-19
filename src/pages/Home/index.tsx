import { useAccount } from "wagmi";
import LottieEarth from "../../assets/animations/earth-lottie.json";
import Lottie from "lottie-react";
import styles from "./home.module.css";
import Plans from "./components/Plans";
import ContractInfo from "./components/ContractInfo";
import SearchUser from "../../components/profile/SearchUser";
import Roadmap from "./components/Roadmap";
import Partners from "./components/Partners";
import FAQ from "./components/FAQ";
import LoginButton from "./components/LoginButton";
import ContractDataLine from "./components/ContractDataLine";

export default function Home() {
  const { isConnected } = useAccount();
  if (!isConnected) {
    sessionStorage.removeItem("token");
  }

  return (
    <main className={styles.home}>
      <ContractDataLine />
      <section className={styles.hero}>
        <div
          className={
            "grid lg:grid-cols-2 px-4 xl:py-32 pb-16 container mx-auto"
          }
        >
          <div className={"pt-32 xl:px-24 xl:py-28 px-4 flex justify-center"}>
            <Lottie animationData={LottieEarth} loop={true} />
          </div>
          <div className={"sm:ml-4 lg:px-8 flex items-center p-4 md:p-10"}>
            <div className={"max-w-[300px]"}>
              <span className={"text-white font-bold text-lg "}>
                Rifex is currently one of the top networking platforms You will
                see how it is equitable profitability
              </span>
              <p className="font-light mb-12 text-xl">Secure & Effortless</p>
              <div className="flex flex-wrap gap-4 items-center">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Plans />
      <ContractInfo />
      <SearchUser />
      <Roadmap />
      <Partners />
      <FAQ />
    </main>
  );
}
