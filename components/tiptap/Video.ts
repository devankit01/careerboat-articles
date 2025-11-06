import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; controls?: boolean; poster?: string }) => ReturnType;
    };
  }
}

const Video = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: { controls: true },
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true, parseHTML: (el) => el.hasAttribute('controls') },
      poster: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs: options }).run();
        },
    };
  },
});

export default Video;
