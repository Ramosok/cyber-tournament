import styles from './footer.module.css';
import { Icon } from '@/shared/ui/icon';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__mainBox}>
        <div className={`${styles.footer__column} ${styles.footer__column_type_apps}`}>
          <a
            className={styles.footer__appLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://onelink.to/ssr7eu">
            <Icon width="100" height="30" icon="appStore" />
          </a>
          <a
            className={styles.footer__appLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://onelink.to/ssr7eu">
            <Icon width="100" height="30" icon="androidStore" />
          </a>
        </div>

        <div className={`${styles.footer__column} ${styles.footer__column_type_details}`}>
          <Icon className={styles.footer__detailsLogo} width="26" height="26" icon="21" />
          <p className={styles.footer__detailsText}>
            ООО Финансово-инвестиционная компания &laquo;ИНХО&raquo; Специальное разрешение
            (лицензия) &#8470;&nbsp;33120/586&nbsp;на право осущ. деятельности в&nbsp;сфере игорного
            бизнеса. УНП 191318808. &copy;&nbsp; {currentYear} Букмекерская компания Maxline. Все
            права защищены.
          </p>
        </div>

        <div className={`${styles.footer__column} ${styles.footer__column_type_socials}`}>
          <a
            className={styles.footer__socialLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.youtube.com/channel/UC9PLwT3BtDbbZAuExTA5RFQ">
            <Icon width="14" height="10" icon="youtube" />
          </a>
          <a
            className={styles.footer__socialLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://vk.com/maxlineby">
            <Icon width="16" height="8" icon="vk" />
          </a>
          <a
            className={styles.footer__socialLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/maxlineofficial/">
            <Icon width="14" height="14" icon="instagram" />
          </a>
          <a
            className={styles.footer__socialLink}
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/maxlineofficial">
            <Icon width="14" height="12" icon="tg" />
          </a>
        </div>
      </div>
    </footer>
  );
};
