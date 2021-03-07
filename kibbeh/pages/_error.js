const ErrorPage = ({ code }) =>
  <>
    {code
      ? <h1>{code} - Internal error</h1>
      : <h1>An error occurred</h1>
    }
  </>;

export default ErrorPage;
