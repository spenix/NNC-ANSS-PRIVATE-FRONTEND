
import React, { useState, useEffect } from "react";
import { Row, Col, Space, Card, DatePicker, Avatar } from "antd";
import moment from "moment";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { useSelector, useDispatch } from "react-redux";
import FlagIcon from '../../../utils/global-components/FlagIcon';
import PageColumn1 from './dashboard-components/PageColumn1';
import PageColumn2 from './dashboard-components/PageColumn2';
import PoliciesTable from './dashboard-components/PolicyAndProgrammes';
import SocialsTable from './dashboard-components/SocialProtectionProgrammes';
import Legends from '../../../utils/global-components/Legends'; 
// import SelectIndicatorCategory from './dashboard-components/SelectIndicatorCategory';
import avatarImg from "../../../assets/images/anss-image/viber_image_2022-04-27_21-17-14-672.png";
import nncLogoEdited from "../../../assets/images/anss-image/nnc_logo_edited.jpg";
import { getLatestManual } from "../../../redux/userManual/userManualActions";
import { RiMailLine, RiShieldUserLine } from "react-icons/ri";
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif} from '../../../utils/global-functions/minor-functions';
const HomePage = (props) => {
    const { pageRoles } = props;
    const [selectedOrg, setSelectedOrg] = useState({organization_id: 0, organization: ''});
    var currentYr = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYr);
    const [allowCountrySelect, setAllowCountrySelect] = useState(false);
    const dispatch = useDispatch();
    const [fetchData, setFetchData] = useState(false);
    const { userManual_data: {attributes, id} } = useSelector((state) => state.userManual);

    const { myprofile } = useSelector((state) => state.users);
    const getManual = () => {
            dispatch(getLatestManual())
            .then(() => {setFetchData(true)})
            .catch((e) => {
                setFetchData(false);
                infoMsg("No user manual document found...")
            });
    }
    function onChange(date, dateString) {
        if(dateString){
            setSelectedYear(dateString)
        }
    }
    useEffect(() => {
        if(Object.keys(myprofile).length){
            const {organization, roles} = myprofile;
            setAllowCountrySelect(roles.includes('system_administrator') ||  roles.includes('secretariat')) 
            setSelectedOrg({organization_id : organization?.party_id, organization: organization?.name})
            getManual();
        }
    }, [myprofile])
   
    return (
        <>
        <div className="hp-mb-24">
            <Row gutter={[32, 32]} justify="space-between">
                <Col md={9} xs={9} span={24}>
                <BreadCrumbs
                    homePage="Dashboard"
                />
                </Col>
                <Col md={15} xs={9} span={24} align="right">
                    <Space >
                        <FlagIcon country={myprofile?.organization?.name} />
                        <label style={{fontWeight: "bold", fontSize:"1.125rem"}}>{myprofile?.organization?.name}</label>
                    </Space>

                </Col>
            </Row>
        </div>
        <Row 
        className="hp-mb-10"
         gutter={{
            xs: 2,
            sm: 4,
            md: 8,
            lg: 16,
        }}
        >
            <Col span={24}>
                <Space>
                    <label style={{ fontWeight: "bold"}}>Legend:</label>
                    <Legends no_indecators={[]} view_stat={true}/>
                </Space>
            </Col>
            <Col md={12} span={24} className="hp-mb-10">
                <Card style={{ width: "100%", minHeight: "525px"}}>
                        <Row className="hp-mb-10">
                            <Col md={16} xs={24} span={24} className="hp-mb-10">
                                <b>Indicator Data Entry</b>
                            </Col>
                            {
                               allowCountrySelect ?
                                (
                                    <Col md={8} xs={24} span={24} className="hp-mb-10" align="end">
                                        <DatePicker onChange={onChange} defaultValue={moment()} style={{ width: "100%" }} picker="year" />
                                            {/* <label ><span style={{ fontWeight: "bold"}}>Reporting Year: </span>{currentYr}</label> */}
                                    </Col>
                                ) : ""
                            }
                            <Col span={24}>
                                <PageColumn1 allowCountrySelect={allowCountrySelect} setSelectedOrg={setSelectedOrg} currYear={allowCountrySelect ? selectedYear : currentYr}/>
                            </Col>
                        </Row>
                </Card>
            </Col>
            <Col md={12} span={24} className="hp-mb-10">
                <Card style={{ width: "100%", minHeight: "525px" }}>
                    <Row justify="end" align="left" className="hp-mb-10">
                        <Col md={16} xs={24} span={24}>
                            <label style={{ fontWeight: "bold"}}>Data Entry Progress <br /><small><b>Country:</b> {selectedOrg.organization}</small></label>
                        </Col>
                        {
                               allowCountrySelect ?
                                (
                                    <Col md={8} xs={24} span={24} className="hp-mb-10" align="end">
                                        
                                            <label ><span style={{ fontWeight: "bold"}}>Reporting Year: </span>{selectedYear}</label>
                                    </Col>
                                ) : (
                                <Col md={8} xs={24} span={24}>
                                    <DatePicker onChange={onChange} defaultValue={moment()} style={{ width: "100%" }} picker="year" />
                                </Col>
                                )
                            }
                       
                    </Row>
                    <PageColumn2 selectedYear={selectedYear} selectedOrg={selectedOrg}/>
                    
                </Card>
            </Col>
            <Col sm={12} md={12} span={24}>
                <Card style={{ width: "100%" }}>
                    <Row className="hp-mb-10">
                        <Col md={24} xs={24} span={24}><b>Policies and Programmes</b></Col>
                        {/* <Col md={8} xs={24} span={24} align="end"><label><b>Country: </b>{selectedOrg.organization}</label> </Col> */}
                        <Col span={24} className="hp-mt-10">
                            <PoliciesTable />
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col sm={12} md={12} span={24}>
                <Card style={{ width: "100%" }}>
                    <Row className="hp-mb-10">
                        <Col md={24} xs={24} span={24}><b>Social Protection Programmes</b></Col>
                        {/* <Col md={8} xs={24} span={24} align="end"><label><b>Country: </b>{selectedOrg.organization}</label> </Col> */}
                        <Col span={24} className="hp-mt-10">
                            <SocialsTable />
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row 
            justify="space-between" 
            className="hp-mb-10"
            gutter={{
                xs: 2,
                sm: 4,
                md: 8,
                lg: 16,
            }}
        >
            
            <Col  md={24} xs={24} span={24} style={{marginBottom:"10px"}}>
                <Card style={{ width: "100%"  }}>
                    <Row className="hp-mb-32">
                        <Col span={24}>
                            <Space>
                                <Avatar src={avatarImg} size={50} className="hp-cursor-pointer" />
                                <Avatar src={nncLogoEdited} size={50} className="hp-cursor-pointer" />
                            </Space>
                            <h3>Support</h3>
                        </Col>
                        <Col md={8} sm={24} span={24}>
                        <h5 style={{ fontWeight: "bold" }}>ASEAN SECRETARIAT</h5>
                            <Row justify="space-between" gutter={[8, 8]}>
                                <Col md={24} xs={24} span={24}><b><RiShieldUserLine className="remix-icon" /> Lina Rospita</b></Col>
                                <Col md={24} xs={24} span={24}><label><RiMailLine className="remix-icon"/> lina.rospita@asean.org</label></Col>
                            </Row>
                        </Col>
                        <Col md={8} sm={24} span={24}>
                        <h5 style={{ fontWeight: "bold" }}>PHILIPPINES</h5>
                            <Row justify="space-between" gutter={[8, 8]}>
                               <Col md={24} xs={24} span={24}><b><RiShieldUserLine className="remix-icon" /> Ellen Ruth F. Abella</b></Col>
                               <Col md={24} xs={24} span={24}><label><RiMailLine className="remix-icon"/> ellen.abella@nnc.gov.ph</label></Col>
                           </Row>
                        </Col>
                        <Col md={8} sm={24} span={24}>
                                     <Row className="hp-mt-32 hp-mb-32">
                                        <Col span={24}>
                                            <label>
                                                USER GUIDES
                                            </label>
                                            
                                        </Col>
                                        <Col span={24}>
                                            {
                                                fetchData ? ( <a  href={attributes?.document_url} target="_blank">ANSS User Manual</a>) : ( <a  onClick={() => { infoMsg("No user manual document found...")}}>ANSS User Manual</a>)
                                            }
                                            
                                        </Col>
                                    </Row>
                        </Col>
                        
                    </Row>
                </Card>
            </Col>
        </Row>
        </>
    );
}

export default HomePage;