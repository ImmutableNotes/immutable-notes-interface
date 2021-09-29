import { connect } from '../utils/wep-state';

type Props = { key: string };

const _____ = ({ key }: Props) => {
  return (
    <div className="">
      <p>{key}</p>
    </div>
  );
};

export default connect('key')(_____);
