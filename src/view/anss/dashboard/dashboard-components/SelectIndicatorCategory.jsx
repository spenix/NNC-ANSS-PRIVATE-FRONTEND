import { Select } from 'antd';
import {getAllData} from '../../../../redux/indicatorCategories/indicatorCategoriesActions';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectIndicatorCategory = ({setSelectedCategory}) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const indicatorCategories = useSelector((state) => state.indicatorCategories)

  useEffect(() => {
    dispatch(getAllData())
  }, [dispatch])
  const data = [];
  for (let i = 0; i < indicatorCategories.allData.length; i++) {
    data.push({
      key: indicatorCategories.allData[i].id,
      datail:  {name: indicatorCategories.allData[i]?.name, key: indicatorCategories.allData[i].id},
      name:  indicatorCategories.allData[i]?.name,
      description: indicatorCategories.allData[i]?.description,
    });
  };
const onChange = (value) => {
  setSelectedCategory(value);
}
  return (
    <>
      <Select
      showSearch
      style={{ width: "100%" }}
      placeholder="Search to Indicator Category"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      filterSort={(optionA, optionB) =>
        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
      }
      onChange={onChange}
    >
      {
        data.map(item => {
          return (
            <Option key={item?.key} value={item?.name}>{item?.name}</Option>
          );
        })
      }
      
      
    </Select>
    </>
  )
};

export default SelectIndicatorCategory;