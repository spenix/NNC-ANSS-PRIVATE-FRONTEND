import React from 'react'
import { Button, Modal } from 'antd';
export default function PrivacyPolicyModal({isModalVisible, setIsModalVisible, setIsPrivacyPolicy}) {

  const handleOk = () => {
    setIsModalVisible(!isModalVisible)
    setIsPrivacyPolicy(true)
  }
  return (
    <Modal 
    title="Privacy Policy" 
    visible={isModalVisible} 
    width={600}
    okText="Yes, I Agree"
    onOk={handleOk} 
    onCancel={() => setIsModalVisible(!isModalVisible)}
    >
        <p>
          <b>Privacy Policy</b>
          <br/>
          <br/>
          We want you to understand how and why the <b>ASEAN Nutrition Surveillance System</b> (“ANSS,” “we” or “us”) collects, uses, and shares information about you when you use our portal, websites, mobile apps, and widgets (collectively, the "Services") or when you otherwise interact with us or receive a communication from us.
          <br/>
          <br/>
          What We Collect<br/>
          Information You Provide to Us<br/>
          We collect the information you provide to us directly when you use the Services. This includes:<br/><br/>
          Account information. To create an account, you must provide a username and password. Your username is public, and it doesn’t have to be related to your real name. You may also provide an email address. We also store your user account preferences and settings.
          <br/>
          <br/>
          Data you submit. We collect the data you submit to the Services. Your data may include text, links, and secure documents.
          <br/>
          <br/>
          Actions you take. We collect information about the actions you take when using the Services. This includes your interactions with ANSS data, saving, and reporting. 
          <br />
          <br />
          Other information. You may choose to provide other information directly to us. For example, we may collect information when you fill out a form, participate in ANSS - sponsored activities, request support, or otherwise communicate with us.
          <br />
          <br />
          Information We Collect Automatically<br />
          When you access or use our Services, we may also automatically collect information about you. This includes:
          <br/>
          <br/>
          Log and usage data. We may log information when you access and use the Services. This may include your IP address, user-agent string, browser type, operating system, referral URLs, device information (e.g., device IDs), pages visited, links clicked, the requested URL, hardware settings, and search terms. Except for the IP address used to create your account, ANSS will delete any IP addresses collected after 100 days.
          <br/>
          <br/>
          Information is collected from cookies and similar technologies. We may receive information from cookies, which are pieces of data your browser stores and sends back to us when making requests, and similar technologies. We use this information to improve your experience, understand user activity, personalize content and advertisements, and improve the quality of our Services. For example, we store and retrieve information about your preferred language and other settings. For more information on how you can disable cookies, please see “Your Choices” below.
          <br/>
          <br/>
          Location information. We may receive and process information about your location. For example, with your consent, we may collect information about the specific location of your mobile device (for example, by using GPS or Bluetooth). We may also receive location information from you when you choose to share such information on our Services, including by associating your content with a location, or we may derive your approximate location from other information about you, including your IP address.
        </p>
      </Modal>
  )
}
