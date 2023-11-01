function FormError({ error }: { error: string }) {
  const errorStyles = (errorVisible: boolean) => {
    return {
      display: errorVisible ? 'block' : 'none',
      color: 'red',
      marginTop: 6,
    };
  };

  return <div style={errorStyles(!!error)}>{error}</div>;
}

export default FormError;
