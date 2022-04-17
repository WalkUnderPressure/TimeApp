import React, { useMemo } from 'react'
import { isValidDate } from '../helpers';

function Time(props) {
  const { title, time, formater } = props;

  const FormatedTime = useMemo(() => {
    return isValidDate(time)
      ? formater(time)
      : '-- : -- : --';
  }, [time]);

  return (
    <div>
        <h2 className='Title'>
          {title}
        </h2>

        <h2 className='Time'>
          {FormatedTime}
        </h2>
    </div>
  )
}

export default Time;
