import { isUndefined, isNumber, isArray } from 'lodash';
import React, { useMemo, useContext } from 'react';

import { usePrefixConfig, useComponentConfig } from '../../hooks';
import { DConfigContext } from '../../hooks/d-config';
import { getClassName, mergeStyle } from '../../utils';

export interface DIconProps extends React.SVGAttributes<SVGElement> {
  dName?: string;
  dType?: string;
  dSize?: string | number;
  dColor?: 'success' | 'warning' | 'danger';
  dRotate?: number;
  dSpin?: boolean;
  dSpinSpeed?: string | number;
}

export const DIcon = React.forwardRef<SVGSVGElement, DIconProps>((props, ref) => {
  const dPrefix = usePrefixConfig();
  const {
    dName,
    dType,
    dSize = '1em',
    dColor,
    dRotate,
    dSpin,
    dSpinSpeed = 1,
    className,
    style,
    viewBox,
    children,
    ...restProps
  } = useComponentConfig(DIcon.name, props);

  const iconContext = useContext(DConfigContext).icons;

  const [_viewBox, paths] = useMemo(() => {
    if (!children && isArray(iconContext)) {
      if (isUndefined(dName)) {
        throw new Error('Missing "dName" prop');
      }
      const list = iconContext.find((icon) => icon.name === dName)?.list;
      if (isUndefined(list)) {
        throw new Error(`name "${dName}" dont exist`);
      } else {
        const icon = list.find((icon) => icon.type === dType);
        if (isUndefined(icon)) {
          throw new Error(`type "${dType}" dont exist in "${dName}"`);
        } else {
          return [icon.viewBox, icon.paths.map((path) => <path key={path} d={path}></path>)] as const;
        }
      }
    }

    return [];
  }, [iconContext, dName, dType, children]);

  return (
    <svg
      {...restProps}
      ref={ref}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={_viewBox ?? viewBox}
      fill="currentColor"
      stroke="currentColor"
      height={dSize}
      width={dSize}
      className={getClassName(className, `${dPrefix}icon`, {
        [`${dPrefix}icon--success`]: dColor === 'success',
        [`${dPrefix}icon--warning`]: dColor === 'warning',
        [`${dPrefix}icon--danger`]: dColor === 'danger',
      })}
      style={mergeStyle(style, {
        transform: !isUndefined(dRotate) ? `rotate(${dRotate}deg)` : undefined,
        animation: dSpin === true ? `spin ${dSpinSpeed}${isNumber(dSpinSpeed) ? 's' : ''} linear infinite` : undefined,
      })}
    >
      {paths ?? children}
    </svg>
  );
});
