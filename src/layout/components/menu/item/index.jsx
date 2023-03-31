import React, {useState, useEffect} from "react";
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../../utils/LangConstants';
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { loadCurrentItem } from "../../../../redux/ecommerce/ecommerceActions";
import {
    Menu, Col
} from "antd";
import navigation from "../../../../navigation/vertical";

const { SubMenu } = Menu;

export default function MenuItem(props) {
    const { onClose } = props;
    const [navigationList, setNavigationList] = useState(navigation);
    // const [userRoles, setUserRoles] = useState([]);
    // Redux
    const products = useSelector(state => state.ecommerce.products)
    const customise = useSelector(state => state.customise)
    const { myprofile } = useSelector((state) => state.users);
    // Location
    const location = useLocation();
    const { pathname } = location;
  
    const splitLocation = pathname.split("/")
  
    // Menu
    const splitLocationUrl =
          splitLocation[splitLocation.length - 2] +
          "/" +
          splitLocation[splitLocation.length - 1];
    const dispatch = useDispatch()

    function getItem(label, key, icon, children) {
        return {
          key,
          icon,
          children,
          label,
        };
    }

    useEffect(() => {
        var navList = [];
        var user_roles = [];
        if(Object.keys(myprofile).length){
            navigation.forEach((item, index) => {
                if(item?.roles){
                    const {roles} = myprofile
                    var res = {};
                    if(item.children){
                        res = roles.map(role => {
                            if(item.roles[role].includes(ACTION_VIEW)){
                                var res_child =  item?.children.filter(nav_child => {
                                    if(nav_child.roles[role].includes(ACTION_VIEW)){
                                        if(nav_child?.navLink == `/${splitLocation[1]}`){
                                            document.title = `NNC-ANSS | ${nav_child.title}`;
                                            nav_child?.roles[role].forEach((roleItem) => {
                                                user_roles.push(roleItem);
                                            });
                                        }
                                        return nav_child
                                    }
                                })
                                return {...item, children : res_child}
                            }
                        })
                    }else{
                        res = roles.map(role => {
                            if(item.roles[role].includes(ACTION_VIEW)){
                                if(typeof item?.navLink != 'undefined'){
                                    if(item?.navLink == `/${splitLocation[1]}`){
                                        document.title = `NNC-ANSS | ${item.title}`;
                                        item?.roles[role].forEach((roleItem) => {
                                            user_roles.push(roleItem);
                                        });
                                    }
                                    else{
                                        if(`/${splitLocation[1]}` == '/' && item?.navLink == "/dashboard"){
                                            document.title = `NNC-ANSS | Dashboard`;
                                            item?.roles[role].forEach((roleItem) => {
                                                user_roles.push(roleItem);
                                            });
                                        }
                                    }
                                }
                                return item; 
                            }
                        })
                    }
                    if(Object.keys(res).length){
                       
                        if(typeof res[0] != 'undefined')
                        {
                            navList.push({...res[0]});
                        }
                    }
                }else{
                    navList.push({...item})
                }
            });
        }
        dispatch({
            type: 'SET_PAGE_PERMISSION',
            roles: [...new Set(user_roles)],
        });
        setNavigationList(navList)
    }, [myprofile, splitLocationUrl])


    const setNavTitle = (title) => {
        const {roles} = myprofile;
    
        switch (title) {
            case "Custodian":
                    return `${myprofile?.roles?.includes("system_administrator") ? "International" : "National"} ${title}`;
                break;
            case "Data Entry":
                    return myprofile?.roles?.includes("system_administrator") ||  myprofile?.roles?.includes("data_manager") ? title : "Indicator Approval";
                break;
            default:
                    return title;
                break;
        }
    }

    const menuItem = () => {
        return navigationList.map((item, index) => {
            if (item.header) {
                    return <Menu.ItemGroup key={index} title={item.header}></Menu.ItemGroup>;
            }
            if (item.children) {
                return (
                    <SubMenu key={item.id} icon={item.icon} title={item.title}>
                        {item.children.map((childrens, index) => {
                            if (!childrens.children) {
                                const childrenNavLink = childrens.navLink.split("/");
                                return (
                                    // Level 2
                                    <Menu.Item
                                    
                                        key={childrens.id}
                                        className={
                                            splitLocationUrl ===
                                                childrenNavLink[childrenNavLink.length - 2] +
                                                "/" +
                                                childrenNavLink[childrenNavLink.length - 1]
                                                ? "ant-menu-item-selected"
                                                : "ant-menu-item-selected-in-active"
                                        }
                                        onClick={onClose}
                                    >
                                        {
                                            childrens.id === 'product-detail' ? (
                                                <Link
                                                    to={childrens.navLink}
                                                    onClick={() => dispatch(loadCurrentItem(products[0]))}
                                                >
                                                    {childrens.title}
                                                </Link>
                                            ) : (
                                                (childrens.id.split("-")[0]) === 'email' ? (
                                                    <a href={childrens.navLink} target="_blank">{childrens.title}</a>
                                                ) : (
                                                    <Link to={childrens.navLink} style={{ marginLeft: "25px" }}>{childrens.title}</Link>
                                                )
                                            )
                                        }
                                    </Menu.Item>
                                );
                            }
                        })}
                    </SubMenu>
                );
            } else {
                const itemNavLink = item.navLink.split("/");
                return (
                    // Level 1
                    <Menu.Item
                        key={item.id}
                        icon={item.icon}
                        onClick={onClose}
                        className={
                            splitLocation[splitLocation.length - 2] +
                                "/" +
                                splitLocation[splitLocation.length - 1] ===
                                itemNavLink[itemNavLink.length - 2] +
                                "/" +
                                itemNavLink[itemNavLink.length - 1]
                                ? "ant-menu-item-selected"
                                : "ant-menu-item-selected-in-active"
                        }
                        
                    >
                        <Link to={item.navLink}>
                            {setNavTitle(item.title)}
                        </Link>
                    </Menu.Item>
                );
            }
        })
    }

    return (
        <Menu
            mode="inline"
            defaultOpenKeys={[
                splitLocation.length === 5
                    ? splitLocation[splitLocation.length - 3]
                    : null,
                    splitLocation[splitLocation.length - 2],
                ]}
            theme={customise.theme = "light"}
            >
            {menuItem()}
        </Menu>
    );
};