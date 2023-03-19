import Head from "next/head";
import ProtectedRoute from "src/components/ProtectedRoute";
import { DashboardLayout } from "src/components/dashboard-layout";

const Home = () => {
  return (
    <>
      <Head>
        <title>Arcum X</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
    </>
  );
};

Home.getLayout = (page) => (
  <ProtectedRoute>
    <DashboardLayout>{page}</DashboardLayout>
  </ProtectedRoute>
);

export default Home;
