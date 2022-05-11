import classNames from 'classnames';
import styles from './VercelLoading.module.css';

const VercelLoading = () => {
  return (
    <>
      <div className="fixed bottom-[10px] right-[20px] z-[99999]">
        <div
          id="container"
          className={classNames(
            styles.container,
            styles.visible,
            styles.building
          )}
        >
          <div id="icon-wrapper" className={styles['icon-wrapper']}>
            <svg viewBox="0 0 226 200">
              <defs>
                <linearGradient
                  x1="114.720775%"
                  y1="181.283245%"
                  x2="39.5399306%"
                  y2="100%"
                  id="linear-gradient"
                >
                  <stop stopColor="#000000" offset="0%"></stop>
                  <stop stopColor="#FFFFFF" offset="100%"></stop>
                </linearGradient>
              </defs>
              <g
                id="icon-group"
                fill="none"
                stroke="url(#linear-gradient)"
                strokeWidth="18"
                className={styles['icon-group']}
              >
                <path d="M113,5.08219117 L4.28393801,197.5 L221.716062,197.5 L113,5.08219117 Z"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default VercelLoading;
