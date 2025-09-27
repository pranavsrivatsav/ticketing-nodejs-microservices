import Header from "@/components/header";
import api from "@/services/axiosInterceptors";
import "bootstrap/dist/css/bootstrap.css";

const app = (props) => {
  const { Component, pageProps, user } = props;
  return (
    <>
      <Header {...pageProps} user={user}/>
      <Component {...pageProps} user={user}/>
    </>
  );
};

app.getInitialProps = async (context) => {
  //get the child component context (ctx) to get the request object
  const request = context?.ctx?.req;

  let user;

  try {
    const response = await api.get("/api/users/current-user", {
      headers: request?.headers,
    });

    user = response.data;
  } catch (error) {
    console.log(error)
    user = null;
  }

  //call the child components initial props, and append it to the return object
  let componentInitialProps = {}
  if(context?.Component?.getInitialProps) {
    componentInitialProps = context.Component.getInitialProps();
  }

  return { user, ...componentInitialProps };
};

export default app