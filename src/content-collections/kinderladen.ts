import { defineCollection, z } from "astro:content";

const tab = `
  show
  title
  content
`;

const query = `
  query Kinderladen {
    page(id: "/unser-kinderladen", idType: URI) {
      id
      kinderladen {
        title
        titleimage {
          node {
            sourceUrl
            altText
          }
        }
        tab1 {
          ${tab}
        }
        tab2 {
          ${tab}
        }
        tab3 {
          ${tab}
        }
        tab4 {
          ${tab}
        }
      }
    }
  }
`;

const TabSchema = z.object({
  show: z.boolean(),
  title: z.string().nullish(),
  content: z.string().nullish(),
});

export type Tab = z.infer<typeof TabSchema>;

export const kinderladen = defineCollection({
  loader: async () => {
    console.log("Loading kinderladen collection data...");
    const response = await fetch("https://backend.kilakaenguruh.de/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          ${query}
        `,
      }),
    });

    const json = await response.json();
    console.log(json);
    return [json.data.page];
  },
  schema: z.object({
    id: z.string(),
    kinderladen: z.object({
      title: z.string().nullish(),
      titleimage: z
        .object({
          node: z.object({
            sourceUrl: z.string().url().nullish(),
            altText: z.string().nullish(),
          }),
        })
        .nullish(),
      tab1: TabSchema,
      tab2: TabSchema,
      tab3: TabSchema,
      tab4: TabSchema,
    }),
  }),
});
