import Header from "@/components/header";
import api from "@/services/axiosInterceptors";
import "bootstrap/dist/css/bootstrap.css";

const app = (props) => {
  const { Component, pageProps, user } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header {...pageProps} user={user}/>
      </div>
      <div style={{ 
        marginTop: '56px', // Approximate navbar height, adjust if needed
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <Component {...pageProps} user={user}/>
      </div>
    </div>
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
  let pageProps = {}
  if(context?.Component?.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context);
  }

  return { user, pageProps };
};

export default app