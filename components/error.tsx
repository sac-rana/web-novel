import styles from './styles/error.module.scss';

export default function Error({ msg }: { msg: string }) {
  return (
    <div className={styles.errorPanel}>
      <p>{msg}</p>;
    </div>
  );
}
