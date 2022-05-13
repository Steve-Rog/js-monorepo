import { Story } from "@storybook/react";
import React, { ComponentProps } from "react";

import { Tabs } from "./Tabs";

export default {
  title: "Tabs",
  component: Tabs
};

const Template: Story<ComponentProps<typeof Tabs>> = (args) => <Tabs {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      id: "tab1",
      label: "tab1",
      content: <div>Tab 1</div>
    },
    {
      id: "tab2",
      label: "tab2",
      content: <div>Tab 2</div>
    },
    {
      id: "tab3",
      label: "disabled",
      content: <div>Tab 3</div>,
      disabled: true
    }
  ],
  initial: "tab1",
  contentClassName: "ui-p-4"
};
