const genOrigin = (host, port) => {
  switch (port) {
    case 80:
      return `http://${host}`;
    case 443:
      return `https://${host}`;
    default:
      return `http://${host}:${port}`;
  }
};

export default genOrigin;
