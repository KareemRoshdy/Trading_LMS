interface HeadProps {
  title: string;
  description: string;
}

const Heading: React.FC<HeadProps> = ({ title, description }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
    </>
  );
};

export default Heading;
