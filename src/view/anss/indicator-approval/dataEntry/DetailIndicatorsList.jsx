import React, { useState, useEffect, useCallback  } from 'react';
import { List, message, Avatar, Skeleton, Divider, Checkbox, Badge  } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import InfiniteScroll from 'react-infinite-scroll-component';
import {getAllData } from "../../../../redux/indicators/indicatorsActions2";
import { getAmsDataByParams } from '../../../../redux/ams-data/amsActions';
import {legends_list} from '../../../../utils/common';
const DetailIndicatorsList = ({setIndicator,setIndicatorIndex, indicatorIndex, year, dataStatus, repository_id, organization_id}) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [itemSelected, setItemSelected] = useState(0);
  const dispatch = useDispatch();
  const {indicator_data, indicator_links, indicator_meta, indicator_details, status, message} = useSelector((state) => state.indicators);
  const {amsData, reloadIndicatorList} = useSelector((state) => state.ams);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
        if(indicator_data.length){
            const dataArr = [...new Set(indicator_data)]
    
            var idx = indicatorIndex
            
            if(['draft', 'returned'].includes(dataStatus) && repository_id != 0){
              idx = dataArr.findIndex((element) => element.id === repository_id );
            }
            var item = dataArr[idx];
            setData(indicator_data);
            indicatorSelected(item, idx);
        }else{
          setTimeout(() => setLoading(false), 1000);
        }
  };

  


  useEffect(() => {
      setLoading(true);
      loadMoreData();
  }, [indicator_data, indicatorIndex]);

  const indicatorSelected = (item, index) => {
    setItemSelected(item?.id);
    setIndicator((prevState) => ({...prevState, item}));
    getAmsData(item?.id);
    setIndicatorIndex(index);
    setLoading(false)
  }

  const getAmsData = (id) =>  {
    dispatch({
      type: 'CLEAR_AMS_DATA_RECORD',
    })
    delayedSearch(
      {
        year,
        repository_id: id,
        organization_id
      }
    );
   
  }

  const delayedSearch = useCallback(
    debounce((q) => fetch(q), 1000),
    [itemSelected]
  );
  
  const fetch = (dataParams) => {
    dispatch(getAmsDataByParams(dataParams));
  }

  const getStatusBadge = (param) => {
    var stat_data = legends_list.filter((item, i) => { 
      if(item.stat_name == (param ? param : "default")) 
                return item
    })[0];

    return stat_data;
  }

  const IndicatorArr = indicator_data?.filter((v,i,a)=>a?.findIndex(v2=>(v2.id===v.id))===i)

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 800,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        backgroundColor: "#fff",
        borderRadius: "2%"
      }}
    >
      <InfiniteScroll
        dataLength={IndicatorArr.length}
        scrollableTarget="scrollableDiv"
      >
        <List
         header={<div><h4>-- Indicators List--</h4></div>}
          dataSource={IndicatorArr}
          loading={loading}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <Badge color={getStatusBadge(item?.attributes?.ams_status).stat_color} text={( <a style={itemSelected == item.id ? {color: "#228B22", fontWeight: "bold", fontSize:"16px"} : {color: "#000000"}} onClick={() => {indicatorSelected(item, index);}}>{item?.attributes.name}</a>)} />
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default DetailIndicatorsList;
