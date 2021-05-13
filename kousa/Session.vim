let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Code/dogehouse/dogehouse/kousa
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +2 lib/kousa/access_token.ex
badd +1 lib/kousa/auth.ex
badd +1 lib/kousa/utils/hash.ex
badd +0 ~/Code/dogehouse/dogehouse/kousa
badd +1 lib/broth.ex
badd +45 lib/broth/socket_handler.ex
badd +1 lib/beef/mutations/rooms.ex
badd +1 lib/beef/queries/rooms.ex
badd +21 lib/beef/room_blocks.ex
badd +79 test/broth/room/ban_test.exs
badd +95 test/_support/factory.ex
badd +25 config/test.exs
badd +0 test/ad_hoc_user_test.exs
argglobal
%argdel
$argadd ~/Code/dogehouse/dogehouse/kousa
edit test/ad_hoc_user_test.exs
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 87 + 88) / 177)
exe '2resize ' . ((&lines * 22 + 23) / 46)
exe 'vert 2resize ' . ((&columns * 89 + 88) / 177)
exe '3resize ' . ((&lines * 21 + 23) / 46)
exe 'vert 3resize ' . ((&columns * 89 + 88) / 177)
argglobal
balt test/broth/room/ban_test.exs
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 47 - ((42 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 47
normal! 0
wincmd w
argglobal
if bufexists("lib/broth/socket_handler.ex") | buffer lib/broth/socket_handler.ex | else | edit lib/broth/socket_handler.ex | endif
if &buftype ==# 'terminal'
  silent file lib/broth/socket_handler.ex
endif
balt lib/beef/room_blocks.ex
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 48 - ((15 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 48
normal! 013|
wincmd w
argglobal
if bufexists("lib/kousa/utils/hash.ex") | buffer lib/kousa/utils/hash.ex | else | edit lib/kousa/utils/hash.ex | endif
if &buftype ==# 'terminal'
  silent file lib/kousa/utils/hash.ex
endif
balt lib/kousa/auth.ex
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 29 - ((10 * winheight(0) + 10) / 21)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 29
normal! 012|
wincmd w
3wincmd w
exe 'vert 1resize ' . ((&columns * 87 + 88) / 177)
exe '2resize ' . ((&lines * 22 + 23) / 46)
exe 'vert 2resize ' . ((&columns * 89 + 88) / 177)
exe '3resize ' . ((&lines * 21 + 23) / 46)
exe 'vert 3resize ' . ((&columns * 89 + 88) / 177)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFA
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
