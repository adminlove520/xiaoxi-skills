export const zh = {
  title: 'Xiaoxi Skills Hub',
  subtitle: '探索与分享智能体技能',
  hero_desc: '为 OpenClaw, Codex 和 AI 智能体打造的终极技能收藏库。',
  search_placeholder: '搜索本地技能...',
  tabs: {
    browse: '浏览',
    discover: '发现',
    leaderboard: '排行榜',
    submit: '提交技能'
  },
  common: {
    all: '全部',
    local: '本地',
    openclaw: 'OpenClaw',
    agents: '智能体',
    loading: '加载中...',
    error: '错误'
  },
  auth: {
    login: '登录',
    logout: '退出登录',
    loading: '正在加载技能...'
  },
  skill_card: {
    copy_btn: '复制命令',
    copied: '命令已复制到剪贴板！',
    built_in: '内置技能',
    view_code: '查看源代码',
    no_desc: '该技能暂无详细描述。',
    install_cmd: '安装命令'
  },
  leaderboard: {
    loading: '正在获取最新排行...',
    error: '加载失败',
    no_data: '暂无排行数据',
    tabs: {
      trending: '🔥 综合趋势',
      github: '★ GitHub Top10',
      clawhub: '⚡ ClawHub 推荐',
      skillssh: '🔧 skill.sh 精选'
    }
  },
  submit: {
    title: '发布你的 Skill',
    subtitle: '分享到 xiaoxi-skills 收藏库',
    auth_needed: '需要 GitHub 授权',
    auth_desc: '登录后即可一键从你的 GitHub 仓库导入 SKILL.md，并自动提交 Pull Request。',
    login_btn: '立即登录',
    import_btn: '从 GitHub 仓库导入',
    modal_title: '从 GitHub 导入 SKILL.md',
    select_repo: '选择一个仓库：',
    back_to_repos: '← 返回仓库',
    parent_dir: '📁 .. (上级目录)',
    recommended: '推荐',
    basic_info: '基本信息',
    skill_id: 'Skill 标识符 (必填)',
    skill_id_placeholder: '如: my-tool',
    short_desc: '简短描述 (必填)',
    short_desc_placeholder: '一句话介绍...',
    submitter_info: '提交者信息',
    github_user: 'GitHub 用户名',
    github_token: 'GitHub Token (可选)',
    token_placeholder_auth: '已登录，此处可选',
    token_placeholder_noauth: '用于自动创建 PR',
    publish_btn: '发布到 Hub',
    publishing: '提交中...',
    editor_title: 'SKILL.md 编辑器',
    editor_placeholder: '# SKILL.md 示例\n\n## name\nmy-skill-id\n\n## description\n这个 Skill 的详细功能描述...',
    manual_title: '📝 请手动完成提交',
    success_title: '✅ 提交成功！',
    pr_waiting: 'PR 已提交，等待审核。',
    view_pr: '查看 Pull Request',
    back_home: '← 返回主页',
    validation: {
      name_required: '请输入 Skill 名称',
      desc_required: '请输入 Skill 描述',
      content_required: '请输入 SKILL.md 内容',
      skill_md_invalid_name: 'SKILL.md 应包含 skill name',
      skill_md_invalid_desc: 'SKILL.md 应包含 description'
    }
  }
};
