import antfu from "@antfu/eslint-config"

export default antfu({
    react: true,
    stylistic: {
        quotes: "double",
        semi: false,
        jsx: true,
        indent: 4,
    },
})
