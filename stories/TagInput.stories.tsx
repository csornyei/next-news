import { ComponentStory, ComponentMeta } from "@storybook/react";
import withMock from "storybook-addon-mock";
import TagInput from "../components/NewFeedForm/TagInput";

export default {
  title: "Components/TagInput",
  component: TagInput,
  argTypes: {
    setTags: {
      action: "tags set:",
      table: {
        disable: true,
      },
    },
    tags: {
      control: { type: "array" },
    },
  },
  args: {
    tags: [],
    setTags: () => {},
  },
  decorators: [withMock],
} as ComponentMeta<typeof TagInput>;

const Template: ComponentStory<typeof TagInput> = (args) => (
  <TagInput {...args} />
);

export const Default = Template.bind({});
Default.parameters = {
  mockData: [
    {
      url: "/api/suggest-tags",
      method: "POST",
      status: 200,
      response: {
        message: ["first", "second"],
      },
    },
  ],
};

export const WithTags = Template.bind({});
WithTags.args = {
  tags: ["first", "second"],
};
WithTags.parameters = {
  mockData: [
    {
      url: "/api/suggest-tags",
      method: "POST",
      status: 200,
      response: {
        message: ["first", "second"],
      },
    },
  ],
};
