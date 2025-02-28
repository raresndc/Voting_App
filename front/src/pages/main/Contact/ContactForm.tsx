import React from 'react';
import Button from "./Button.tsx";
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const ContactForm: React.FC = () => {
  return (
    <section className="max-w-[1000px] mx-auto flex items-center">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex gap-8">
          <Button
            text="VIA CHAT SUPPORT"
            icon={<ChatBubbleLeftIcon className="w-6 h-6" />}
          />
          <Button
            text="VIA CALL"
            icon={<PhoneIcon className="w-6 h-6" />}
          />
        </div>
        <Button
          isSecondary={true}
          text="VIA EMAIL FORM"
          icon={<EnvelopeIcon className="w-6 h-6" />}
        />

        <form className="flex flex-col gap-5 pb-5">
          <div className="relative w-full">
            <label htmlFor="name" className="absolute top-[-12px] left-2.5 bg-white px-2.5 text-[14px]">Name</label>
            <input type="text" name="name" className="h-10 px-2" />
          </div>

          <div className="relative w-full">
            <label htmlFor="email" className="absolute top-[-12px] left-2.5 bg-white px-2.5 text-[14px]">E-Mail</label>
            <input type="email" name="email" className="h-10 px-2" />
          </div>

          <div className="relative w-full">
            <label htmlFor="text" className="absolute top-[-12px] left-2.5 bg-white px-2.5 text-[14px]">Text</label>
            <textarea name="text" rows={5} className="px-2"></textarea>
          </div>
        </form>

        <div className="flex justify-end">
          <Button text="SUBMIT" />
        </div>
      </div>

      <div>
        <img src="/contact.svg" alt="Contact Illustration" />
      </div>
    </section>
  );
};

export default ContactForm;
