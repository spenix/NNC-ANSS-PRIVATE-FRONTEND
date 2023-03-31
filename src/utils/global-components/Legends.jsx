import { useEffect } from 'react';
import { Tag } from 'antd';
import {legends_list} from '../common';
const Legends = ({no_indecators, view_stat}) => {
 
    useEffect(() => {
        get_indicator_no();
    }, []);
    const get_indicator_no = () => {
    }
    return (
            <>
                {
                    legends_list.map((data, i) => {
                        return (<Tag key={i + 1} color={data.stat_color} className="hp-mb-10">{view_stat ? data.stat : "0"}</Tag>)
                    })
                }
            </>
    );
}
export default Legends;