import React, { useMemo, useCallback, useEffect, useReducer } from 'react'
import { useSubscription, gql } from '@apollo/client';
import { FormatToDate, FormatToTime } from '../helpers.js';
import Time from './Time.jsx';

const UPDATE_TIME_ACTION = 'UPDATE_TIME_ACTION';
const SWITCH_TIME_SRC = 'SWITCH_TIME_SRC';
const ONE_SECOND = 1000;

const initialState = {
    isServerTime: false,
    time: new Date(),
};

function reducer(state, action) {
    switch (action.type) {
        case UPDATE_TIME_ACTION: {
            return {
                ...state,
                time: new Date(),
            };
        }
        case SWITCH_TIME_SRC: {
            return {
                ...state,
                isServerTime: !state.isServerTime
            };
        }
        default: {
            return state;
        }
    }
}

const COMMENTS_SUBSCRIPTION = gql`
    subscription MonitorNumChanges {
        currentDateUpdated
    }
`;

function TimeSwitch() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data } = useSubscription(COMMENTS_SUBSCRIPTION);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch({ type: UPDATE_TIME_ACTION});
        }, ONE_SECOND);
    
        return () => {
            clearInterval(intervalId);
        };
    }, [state.isServerTime]);
    
    const SwitchTimeSrc = useCallback(() => {
        dispatch({ type: SWITCH_TIME_SRC });
    }, [state.isServerTime]);
    
    const { SwitchText, TitleText, Formater } = useMemo(() => {
        let items = {
            SwitchText: 'To server time',
            TitleText: 'Client Time',
            Formater: FormatToTime,
        };
        
        if (state.isServerTime) {
            items = {
                SwitchText: 'To client time',
                TitleText: 'Server Date',
                Formater: FormatToDate,
            }
        }
        
        return items;
    }, [state.isServerTime]);

    const TimeValue = state.isServerTime
        ? Number.parseInt(data?.currentDateUpdated)
        : state?.time;
        
    return (
        <div>
            <Time
                time={TimeValue}
                title={TitleText}
                formater={Formater}
            />
            
            <button className='SwitchBtn' onClick={SwitchTimeSrc}>
                {SwitchText}
            </button>
        </div>
    );
}

export default TimeSwitch;
